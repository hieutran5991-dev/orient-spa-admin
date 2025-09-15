import request from "@/lib/axios";
import { AxiosResponse } from "axios";
import { ProductLanguages, ProductListResponse, ProductResponse, UpdateFeaturedOrderRequest, UpdateFeaturedOrderResponse } from "@/types/product";
import { ProductFormData } from "@/lib/validations";
import { Language } from "@/types/language";

export const initializeFormData = (form: ProductFormData, availableLanguages: Language[]) => {
  const formData = new FormData();
  
  // Add basic fields
  formData.append('category_id', parseInt(form.category_id).toString());
  formData.append('duration', parseInt(form.duration).toString());
  formData.append('is_featured', form.is_featured.toString());
  
  // Add prices
  formData.append('prices', JSON.stringify({
    VND: parseFloat(form.prices.VND),
    USD: parseFloat(form.prices.USD)
  }));
  
  // Add image file
  if (form.image) {
    formData.append('image', form.image!);
  }

  const translations = availableLanguages.reduce((acc, language) => {
    if (form.name[language.code] && form.description[language.code]
      && (!form.is_featured || (form.featured_product_description?.[language.code] && form.featured_product_detail?.[language.code]))
    ) {
      acc[language.code] = {
        name: form.name[language.code],
        description: form.description[language.code],
        ...(form.is_featured && form.featured_product_description?.[language.code] && form.featured_product_detail?.[language.code] && {
          featured_product_description: form.featured_product_description[language.code],
          featured_product_detail: form.featured_product_detail[language.code],
        }),
      };
    }
    return acc;
  }, {} as ProductLanguages)
  // Add translations as JSON string
  formData.append('translations', JSON.stringify(translations));

  return formData;
};

// Get list of products
export const getProducts = async (): Promise<AxiosResponse<ProductListResponse>> => {
  return await request.get('products');
};

// Get single product by ID
export const getProduct = async (id: number): Promise<AxiosResponse<ProductResponse>> => {
  return await request.get(`products/${id}`);
};

// Create new product
export const createProduct = async (form: FormData): Promise<AxiosResponse<ProductResponse>> => {
  return await request.post('products', form, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Update product
export const updateProduct = async (id: number, form: FormData): Promise<AxiosResponse<ProductResponse>> => {
  return await request.post(`products/${id}`, form, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Delete product
export const deleteProduct = async (id: number): Promise<AxiosResponse<void>> => {
  return await request.delete(`products/${id}`);
};

// Update featured products order
export const updateFeaturedOrder = async (data: UpdateFeaturedOrderRequest): Promise<AxiosResponse<UpdateFeaturedOrderResponse>> => {
  return await request.put('products/featured/order', data);
};
