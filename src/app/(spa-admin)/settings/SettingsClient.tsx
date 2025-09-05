'use client';

import { useState, useEffect } from 'react';
import { getSettings } from '@/api/setting';
import { Setting } from '@/types/setting';
import SettingForm from '@/components/settings/SettingForm';

export default function SettingsClient() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    getSettings().then(response => {
        if (response.data?.data) {
            setSettings(response.data.data);
        } else {
            setIsError(true);
        }
    }).catch(error => {
      console.error('Error fetching settings:', error);
      setIsError(true);
    });
  }, []);

  return <SettingForm settings={settings} isError={isError} />;
}