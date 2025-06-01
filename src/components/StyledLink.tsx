import { Link, type LinkProps } from "@tanstack/react-router";

export function StyledLink(props: LinkProps) {
  return (
    <Link
      {...props}
      className="
        block px-3 py-2 rounded 
        hover:bg-gray-200 dark:hover:bg-gray-700
        transition 
        text-gray-700 dark:text-gray-200
      "
      activeProps={{
        className: "bg-blue-100 dark:bg-blue-900 font-semibold text-blue-700 dark:text-blue-300",
      }}
    />
  );
}
