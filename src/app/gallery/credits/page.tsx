import { SignedIn} from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import HeaderDescription from "@/components/gallery/HeaderDescription";
import { Button } from "@/components/ui/button";
import { plans } from "@/lib/gallery/constants";
import { getUserById } from "@/actions/gallery/user.actions";
import Checkout from "@/components/gallery/Checkout";

const CreditsPage = async () => {

  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const user = await getUserById(userId);
  const dbId = user._id.toString();

  return (
    <>
      <HeaderDescription
        title="Buy Credits"
        subtitle="Choose a credit package that suits your needs!"
      />

      <section>
        <ul className="mt-11 grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-9 xl:grid-cols-3">
          {plans.map((plan) => (
            <li key={plan.name} className="w-full rounded-[16px] border p-8 shadow-xl lg:max-w-none">
              <div className="flex-center flex-col gap-3">
                <Image src={plan.icon} alt="check" width={50} height={50} />
                <p className="p-20-semibold mt-2">
                  {plan.name}
                </p>
                <p className="text-3xl font-semibold ">${plan.price}</p>
                <p className="p-16-regular">{plan.credits} Credits</p>
              </div>

              {/* Inclusions */}
              <ul className="flex flex-col gap-5 py-9">
                {plan.inclusions.map((inclusion) => (
                  <li
                    key={plan.name + inclusion.label}
                    className="flex items-center gap-4"
                  >
                    <Image
                      src={`/assets/icons/${
                        inclusion.isIncluded ? "check.svg" : "cross.svg"
                      }`}
                      alt="check"
                      width={24}
                      height={24}
                    />
                    <p className="">{inclusion.label}</p>
                  </li>
                ))}
              </ul>

              {plan.name === "Free" ? (
                <Button variant="outline" className="w-full rounded-full bg-cover">
                  Free Consumable
                </Button>
              ) : (
                <SignedIn>
                  <Checkout
                    plan={plan.name}
                    amount={plan.price}
                    credits={plan.credits}
                    buyerId={user._id}
                  />
                </SignedIn>
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default CreditsPage;