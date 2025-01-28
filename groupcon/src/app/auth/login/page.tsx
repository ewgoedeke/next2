import { login, signup } from '../actions'

export default function LoginPage() {
  return (
    <form className="flex flex-col gap-4">
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required className="border p-2 rounded" />

      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required className="border p-2 rounded" />

      <div className="flex gap-4">
        <button formAction={login} className="bg-blue-500 text-white px-4 py-2 rounded">
          Log in
        </button>
        <button formAction={signup} className="bg-green-500 text-white px-4 py-2 rounded">
          Sign up
        </button>
      </div>
    </form>
  );
}
