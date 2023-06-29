import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

// eslint-disable-next-line import/no-anonymous-default-export
const og = () => {
  return new ImageResponse(
    (
      <div tw="flex flex-col w-full h-full justify-between bg-white border-[15px] border-black p-[65px]">
        <div tw="flex flex-col">
          <div tw="flex">
            <p tw="text-4xl border-b-[5px] border-black pb-2 w-fit">Le QCM</p>
          </div>
          <h1 tw="text-7xl font-semibold">
            Créez des quiz interactifs pour vos cours et présentations.
          </h1>
        </div>
        <div tw="flex">
          <div tw="flex">
            <div tw="flex"></div>
            <div tw="flex flex-col ml-4 content-start ">
              <span tw="text-4xl font-medium">Club Info</span>
              <span tw="text-3xl">INSA Toulouse</span>
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
};

export default og;
