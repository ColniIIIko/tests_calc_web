import { MantineThemeOverride } from "@mantine/core";

const theme: MantineThemeOverride = {
  fontFamily: 'Inter, sans-serif',

  colors: {
    gray: [
      '#F1F2F4',
      '#E6E8E6',
      '#CED0CE',
      '#AAB3BB',
      '#ADB5BD',
      '#8E99A4',
      '#5B6671',
      '#444C55',
      '#3F403F',
      '#17191C',
    ],
    green: [
      '#E8FDF3',
      '#D1FAE6',
      '#9FB8AD',
      '#75F0B5',
      '#475841',
      '#14B869',
      '#14B869',
      '#0F8A4F',
      '#0A5C34',
      '#052E1A',
    ],
    red: [
      '#FBE9E9',
      '#F7D4D4',
      '#F0A8A8',
      '#E87D7D',
      '#E15151',
      '#DF4747',
      '#AE1E1E',
      '#821717',
      '#570F0F',
      '#2B0808',
    ],
  },

  fontSizes: {
    xs: '14px',
    sm: '16px',
    md: '18px',
    lg: '20px',
    xl: '24px',
  },

  spacing: {
    xs: '8px',
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '40px',
  },
}

export default theme;
