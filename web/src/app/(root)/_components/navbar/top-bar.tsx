import Link from "next/link";

const TopBar = () => {
  return (
    <div className="bg-linear-to-r from-purple-600 to-blue-600 text-white py-2">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm">
        <p>🎉 Free shipping on orders over $50!</p>
        <div className="flex items-center gap-4 ml-auto">
          <Link href="#" className="hover:underline">
            Track Order
          </Link>
          <Link href="#" className="hover:underline">
            Help
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
