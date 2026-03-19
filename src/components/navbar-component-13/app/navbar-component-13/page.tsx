import Navbar from '@/components/shadcn-studio/blocks/navbar-component-13/navbar-component-13'

const navigationData = [
  {
    title: 'Dashboard',
    items: [
      { title: 'Overview', href: '#' },
      { title: 'Sales Summary', href: '#' },
      { title: 'Visitors Analytics', href: '#' },
      { title: 'Conversion Rates', href: '#' },
      { title: 'Revenue Reports', href: '#' }
    ]
  },
  {
    title: 'Overview',
    items: [
      { title: 'Add Product', href: '#' },
      { title: 'Product Categories', href: '#' },
      { title: 'Inventory Status', href: '#' },
      { title: 'Low Stock Alerts', href: '#' }
    ]
  },
  {
    title: 'Layout',
    items: [
      { title: 'Storefront Settings', href: '#' },
      { title: 'Homepage Layout', href: '#' },
      { title: 'Banner Management', href: '#' },
      { title: 'Theme Customization', href: '#' }
    ]
  },
  {
    title: 'Order',
    items: [
      { title: 'All Orders', href: '#' },
      { title: 'Pending Orders', href: '#' },
      { title: 'Shipped Orders', href: '#' },
      { title: 'Refund Requests', href: '#' },
      { title: 'Abandoned Carts', href: '#' }
    ]
  },
  {
    title: 'Applications',
    items: [
      { title: 'Marketing Tools', href: '#' },
      { title: 'Loyalty & Rewards', href: '#' },
      { title: 'Third-party Apps', href: '#' },
      { title: 'App Marketplace', href: '#' }
    ]
  }
]

const NavbarPage = () => {
  return (
    <div className='h-135'>
      <Navbar navigationData={navigationData} />
    </div>
  )
}

export default NavbarPage
