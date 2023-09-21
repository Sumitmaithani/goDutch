import {AnimationObject} from 'lottie-react-native';

export interface OnboardingData {
  id: number;
  animation: AnimationObject;
  text: string;
  subtext: string;
  textColor: string;
  backgroundColor: string;
}

const data: OnboardingData[] = [
  {
    id: 1,
    animation: require('../../assets/onboarding/animations/Lottie4.json'),
    text: 'Discover Solo Adventures',
    subtext:
      'Explore the world on your terms and connect with fellow solo travelers.',
    textColor: 'white',
    backgroundColor: '#6661D2',
  },
  {
    id: 2,
    animation: require('../../assets/onboarding/animations/Lottie8.json'),
    text: 'Unlock Mystical Journeys',
    subtext:
      'Find your tribe of adventurous souls and embark on unforgettable journeys together.',
    textColor: 'white',
    backgroundColor: '#FF6B6B',
  },
  {
    id: 3,
    animation: require('../../assets/onboarding/animations/Lottie6.json'),
    text: 'Travel with Confidence',
    subtext:
      'Navigate new horizons safely and securely with our solo traveler community.',
    textColor: 'white',
    backgroundColor: '#00C49A',
  },
];

export default data;
