import Link from 'next/link'

export default function Home() {
  console.log('Landing page')
  return (
    <div>
      <p>Landing page</p>
      
      <Link href={'/auth/login'}>login</Link>
    </div>
  );
}
