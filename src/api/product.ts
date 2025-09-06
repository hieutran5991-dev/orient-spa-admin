import request from "@/lib/axios";
import { AxiosResponse } from "axios";
import { ProductLanguages, ProductListResponse, ProductResponse } from "@/types/product";
import { ProductFormData } from "@/lib/validations";
import { Language } from "@/types/language";

export const initialFormData = (form: ProductFormData, availableLanguages: Language[]) => {
  const formData = new FormData();
  
  // Add basic fields
  formData.append('category_id', parseInt(form.category_id).toString());
  formData.append('duration', parseInt(form.duration).toString());
  formData.append('is_promoted', form.is_promoted.toString());
  
  // Add image file
  if (form.image) {
    formData.append('image', form.image!);
  }

  const translations = availableLanguages.reduce((acc, language) => {
    if (form.name[language.code] && form.description[language.code] && form.price[language.code] && form.currency[language.code]
      && (!form.is_promoted || (form.promotion_description?.[language.code] && form.promotion_details?.[language.code]))
    ) {
      acc[language.code] = {
        name: form.name[language.code],
        description: form.description[language.code],
        price: parseFloat(form.price[language.code]),
        currency: form.currency[language.code],
        ...(form.is_promoted && form.promotion_description?.[language.code] && form.promotion_details?.[language.code] && {
          promotion_description: form.promotion_description[language.code],
          promotion_details: form.promotion_details[language.code],
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
