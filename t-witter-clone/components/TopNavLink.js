import Link from "next/link";

export default function TopNavLink({ title = "Tweet", url = "/" }) {
  return (
    <Link href={url}>
      <div className="flex mb-5 cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 mt-1 mr-3"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
        {title}
      </div>
    </Link>
  );
}
