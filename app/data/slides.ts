export type CarouselSlide = {
  src: string;
  alt: string;
  label: string;
  cloudBg: string;
  imageSize?: { width: number; height: number };
};

export const slides: CarouselSlide[] = [
  {
    src: "/prizes/meta_quest.png",
    alt: "Meta Quest 3",
    label: "meta quest",
    cloudBg: "/background/yellow.png",
  },
  {
    src: "/prizes/digital_camera.png",
    alt: "digital camera",
    label: "digital camera",
    cloudBg: "/background/pink.png",
    imageSize: { width: 240, height: 190 },
  },
  {
    src: "/prizes/airpods_pro.png",
    alt: "AirPods",
    label: "airpods",
    cloudBg: "/background/blue.png",
  },
  {
    src: "/prizes/keyboard.png",
    alt: "keyboard",
    label: "keyboard",
    cloudBg: "/background/purple.png",
  },
];
