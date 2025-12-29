export type CarouselSlide = {
  src: string;
  alt: string;
  label: string;
  cloudBg: string;
};

export const slides: CarouselSlide[] = [
  {
    src: "/prizes/meta_quest.png",
    alt: "Meta Quest 3",
    label: "meta quest 3",
    cloudBg: "/background/yellow.png",
  },
  {
    src: "/prizes/digital_camera.png",
    alt: "Digital camera",
    label: "digital camera",
    cloudBg: "/background/pink.png",
  },
  {
    src: "/prizes/airpods_pro.png",
    alt: "AirPods Pro",
    label: "airpods pro",
    cloudBg: "/background/blue.png",
  },
  {
    src: "/prizes/keyboard.png",
    alt: "Mechanical keyboard",
    label: "mechanical keyboard",
    cloudBg: "/background/purple.png",
  },
];
