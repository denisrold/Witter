export default function UsernameForm() {
  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit className="text-center">
        <h1 className="text-xl mb-2">Pick a username</h1>
        <input
          type="text"
          className="block mb-1 bg-twitterBorder px-3 py-1 rounded-full"
          placeholder={"username"}
        ></input>
        <button className="block bg-twitterBlue w-full rounded-full py-1">
          Continue
        </button>
      </form>
    </div>
  );
}
