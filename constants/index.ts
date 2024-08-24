export const headerLinks = [
  {
    label: 'Home',
    route: '/',
  },
  {
    label: 'Create',
    route: '/events/create',
  },
  {
    label: 'Profile',
    route: '/profile',
  },
  {
    label:'Find Photos',
    route:'/photos'
  }
]

export const eventDefaultValues = {
  title: '',
  description: '',
  location: '',
  imageUrl: '',
  startDateTime: new Date(),
  endDateTime: new Date(),
  categoryId: '',
  price: '',
  isFree: false,
  url: '',
}
