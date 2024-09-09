import { getAllImages } from "@/actions/gallery/image.actions";
import { Collection } from "@/components/gallery/Collection";
import { navLinks } from "@/lib/gallery/constants";
import Image from "next/image";
import Link from "next/link";

export default async function GalleryPage({ searchParams } : SearchParamProps) {

  const page = Number(searchParams?.page) || 1;
  const searchQuery = (searchParams?.query as string) || "";

  const images = await getAllImages({ page, searchQuery})

  return (
    <>
      <div className='md:flex hidden h-72 flex-col justify-center items-center gap-4 rounded-[20px] border bg-muted bg-no-repeat p-10 shadow-inner'>
        <h1 className="text-3xl font-bold">Unleash YOUR Creative Vision</h1>
        <ul className="flex items-center justify-center w-full gap-20 mt-10">
          {navLinks.slice(0, 4).map((link) => (
            <Link key={link.route} href={link.route} className="flex items-center justify-center flex-col gap-2">
              <li className="flex items-center justify-center w-fit rounded-lg">
                <Image
                  src={link.icon} alt='image' width={48} height={48}
                />
              </li>
              <p className="flex items-center justify-center font-semibold text-muted-foreground">{link.label}</p>
            </Link>
          ))}
        </ul>
      </div>
      <div>
        <Collection 
          hasSearch={true}
          images={images?.data}
          totalPages={images?.totalPage}
          page={page}
        />
      </div>
    </>
  )
}