"use server"
import CategoryFilter from "@/components/shared/CategoryFilter";
import Collection from "@/components/shared/Collection";
import Search from "@/components/shared/Search";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collission";
import { getAllEvents } from "@/lib/actions/event.actions";
import { SearchParamProps } from "@/types";
import Image from "next/image";
import Link from "next/link";


export default async function Home({ searchParams }: SearchParamProps) {
  const page = Number(searchParams?.page) || 1;
  const searchText = (searchParams?.query as string) || "";
  const category = (searchParams?.category as string) || "";

  const events = await getAllEvents({
    query: searchText,
    category,
    page,
    limit: 6,
  });

  return (
    <>
      <section className="bg-black text-white bg-dotted-pattern bg-contain py-5 md:py-10 h-screen justify-center">
        <BackgroundBeamsWithCollision >
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 id="text" className="h1-bold">
              Host, Connect, Celebrate: Your Events, <span className='text-purple-600'>Our Platform!</span>
            </h1>
            <p id="para" className="p-regular-20 md:p-regular-24">
              Host events with ease, join with joy, capture your full moments,
              and find your photos effortlessly with our face recognition
              technology.
            </p>
            <button className="relative inline-flex h-12 w-40 overflow-hidden rounded-full p-[2px]">
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-black  px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                <Link href="#events">Explore Now</Link>
              </span>
            </button>
          </div>
          <Image
            src="/assets/images/eventsnap.jpg"
            alt="hero"
            width={1500}
            height={1500}
            className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"
          />
        </div>
        </BackgroundBeamsWithCollision>
      </section>

      <section
        id="events"
        className="wrapper my-8 flex flex-col gap-8 md:gap-12"
      >
        <h2 className="h2-bold">
          Trusted by {" "}
          <span className="text-purple-700">Thousands of Events</span>
        </h2>

        <div className="flex w-full flex-col gap-5 md:flex-row">
          <Search />
          <CategoryFilter />
        </div>

        <Collection
          data={events?.data}
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          collectionType="All_Events"
          limit={6}
          page={page}
          totalPages={events?.totalPages}
        />
      </section>
    </>
  );
}

