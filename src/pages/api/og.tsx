// import { ImageResponse } from "@vercel/og";

// export const config = {
//   runtime: "edge",
// };

// // eslint-disable-next-line import/no-anonymous-default-export
// export default function () {
//   return new ImageResponse(
//     (
//       <div tw="flex flex-col w-full h-full justify-between bg-white border-[15px] border-black p-[65px]">
//         <div tw="flex flex-col">
//           <div tw="flex">
//             <p tw="text-4xl border-b-[5px] border-black pb-2 w-fit">Le QCM</p>
//           </div>
//           <h1 tw="text-7xl font-semibold">
//             Créez des quiz interactifs pour vos cours et présentations.
//           </h1>
//         </div>
//         <div tw="flex">
//           <div tw="flex">
//             <div tw="flex"></div>
//             <div tw="flex flex-col ml-4 content-start ">
//               <span tw="text-4xl font-medium">Club Info</span>
//               <span tw="text-3xl">INSA Toulouse</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     ),
//     {
//       width: 1200,
//       height: 630,
//     }
//   );
// }

import { type NextRequest } from "next/server";
import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const title =
    searchParams.get("title") ?? "Tester les connaissances de votre audience.";
  const description =
    searchParams.get("description") ??
    "Créez des quiz interactifs pour vos cours et présentations.";

  return new ImageResponse(
    (
      <div tw="flex flex h-full bg-white p-12">
        <div tw="flex flex-col w-1/2 justify-between ">
          <div tw="flex flex-col">
            <p tw="text-2xl font-semibold">Le QCM</p>
          </div>
          <div tw="flex flex-col">
            <h1 tw="text-[52px]">{title}</h1>
            <p tw="text-[26px] text-neutral-600">{description}</p>
          </div>
        </div>
        <div tw="flex w-1/2 h-full">
          <div tw="w-full h-full flex items-center justify-center">
            <div tw="flex h-[534px] w-[258px] items-center justify-center overflow-hidden rounded-[46px] bg-black p-3">
              <div tw="flex h-full w-full rounded-[37px] bg-white"></div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
