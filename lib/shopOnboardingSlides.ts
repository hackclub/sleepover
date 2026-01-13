export interface ShopOnboardingSlide {
  id: number;
  characterName: string;
  dialogText: string;
  subText?: string;
  characterImage: string;
}

export const shopOnboardingSlides: ShopOnboardingSlide[] = [
  {
    id: 1,
    characterName: "Pancake",
    dialogText: "Woah! You found the shop page!",
    subText: "click to continue!",
    characterImage: "/background/bunny-shocked.png",
  },
  {
    id: 2,
    characterName: "Pancake",
    dialogText: "Here you can redeem feathers for prizes!",
    subText: "click to continue!",
    characterImage: "/background/bunny-happy.png",
  },
  {
    id: 3,
    characterName: "Pancake",
    dialogText: "One hour of coding = 1 feather to spend in the shop!",
    subText: "click to continue!",
    characterImage: "/background/bunny-talking.png",
  },
  {
    id: 4,
    characterName: "Pancake",
    dialogText: "Ready to buy your first item? Stickers are free! Get ready and purchase them now!",
    subText: "click to continue!",
    characterImage: "/background/bunny-happy-turned.png",
  },
];
