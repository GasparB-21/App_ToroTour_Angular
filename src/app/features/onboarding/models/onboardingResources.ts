export type OnboardingImageGroup = {
    ilustracionImg: string;
    tabbarImg: string;
};

export const ONBOARDING_IMAGES: OnboardingImageGroup[] = [
  {
    ilustracionImg: 'images/onboarding/ilustracion/img-onboarding-monumentos.png',
    tabbarImg: 'images/onboarding/tabbar/img-tabbar-monumentos.png',
  },
  {
    ilustracionImg: '/images/onboarding/ilustracion/img-onboarding-eventos.png',
    tabbarImg: 'images/onboarding/tabbar/img-tabbar-eventos.png',
  },
  {
    ilustracionImg: '/images/onboarding/ilustracion/img-onboarding-favoritos.png',
    tabbarImg: 'images/onboarding/tabbar/img-tabbar-favoritos.png',
  },
]as const;

export const ONBOARDING_TEXT: string[] = [
  'Accede a la ubicación e información de los monumentos cercanos desde la pestaña "Monumentos"',
  'Accede al calendario de eventos y a la información de cada uno de ellos desde la pestaña "Eventos"',
  'Accede a tus monumentos y eventos favoritos desde la pestaña de "Favoritos"'
]as const;