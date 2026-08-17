import React, { createContext, useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import { SettingService } from '../lib/api/admin/SettingService';

export interface GlobalSettings {
  website_name?: string;
  website_tagline?: string;
  website_url?: string;
  support_email?: string;
  support_phone?: string;
  
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  
  main_logo?: string;
  dark_logo?: string;
  favicon?: string;
  login_logo?: string;
  footer_logo?: string;
  
  hero_title?: string;
  hero_subtitle?: string;
  footer_copyright?: string;
  
  facebook_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
  twitter_url?: string;
  
  [key: string]: any;
}

interface SettingsContextType {
  settings: GlobalSettings;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({ settings: {}, isLoading: true });

export const useGlobalSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading } = SettingService.usePublicSettings();
  const [settings, setSettings] = useState<GlobalSettings>({});

  useEffect(() => {
    if (data) {
      setSettings(data);
    }
  }, [data]);

  return (
    <SettingsContext.Provider value={{ settings, isLoading }}>
      {/* Inject Global Branding */}
      <Head>
        {settings.website_name && <title>{settings.website_name}</title>}
        {settings.favicon && <link rel="icon" href={settings.favicon} />}
      </Head>
      
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          ${settings.primary_color ? `--primary-color: ${settings.primary_color};` : ''}
          ${settings.secondary_color ? `--secondary-color: ${settings.secondary_color};` : ''}
          ${settings.accent_color ? `--accent-color: ${settings.accent_color};` : ''}
        }
      `}} />
      
      {children}
    </SettingsContext.Provider>
  );
};
