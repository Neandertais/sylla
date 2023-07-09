import { useParams } from "react-router-dom";
import { Avatar } from "antd";

import {
  FacebookOutlined,
  LinkedinOutlined,
  InstagramOutlined,
  GlobalOutlined,
  YoutubeOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import { IoLogoTiktok } from "react-icons/io5";

import useUser from "@hooks/useUser";

export default function Profile() {
  const { username } = useParams();
  const { user, isLoading } = useUser(username);

  if (isLoading) {
    return (
      <div className="animate-pulse my-12">
        <div className="bg-gray-200 rounded-md w-4/12 h-16 mb-3"></div>
        <div className="bg-gray-200 rounded-md w-6/12 h-28 mb-6"></div>
        <div className="bg-gray-200 rounded-md w-6/12 h-16 mb-16"></div>
        <div className="bg-gray-200 rounded-md w-2/12 h-12 mb-6"></div>
        <div className="bg-gray-200 rounded-md w-6/12 h-16"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-12 flex flex-col">
      <div className="flex">
        <div className="flex flex-col flex-1">
          <p className="font-black text-lg text-gray-600">INSTRUTOR</p>
          <h2 className="font-bold text-4xl">{user?.name ? user.name : user?.username}</h2>
          <p className="mt-2 font-bold text-base">{user?.profession}</p>

          <div className="flex gap-6 mt-auto">
            <div>
              <p className="font-black text-gray-500">Total de alunos</p>
              <p className="font-black text-3xl">{user.students}</p>
            </div>
            <div>
              <p className="font-black text-gray-500">Avaliações</p>
              <p className="font-black text-3xl">{user.evaluations}</p>
            </div>
          </div>

          <ul className="flex gap-4 mt-6">
            {Object.entries(user?.socialLinks!).map(([key, link]) => {
              const platform = key as keyof typeof mappedProfileIcons;

              return (
                link && (
                  <a target="_blank" rel="noopener noreferrer" href={link} key={platform}>
                    {mappedProfileIcons[platform]()}
                  </a>
                )
              );
            })}
          </ul>
        </div>
        <Avatar size={180} src={user?.avatarUrl} />
      </div>
      <div>
        <h3 className="mt-6 font-bold text-xl">Sobre</h3>
        <p className="mt-2 text-base">{user?.biography}</p>
      </div>
    </div>
  );
}

export const mappedProfileIcons = {
  website: (size = 22) => <GlobalOutlined style={{ fontSize: size }} />,
  youtube: (size = 22) => <YoutubeOutlined style={{ fontSize: size }} />,
  instagram: (size = 22) => <InstagramOutlined style={{ fontSize: size }} />,
  facebook: (size = 22) => <FacebookOutlined style={{ fontSize: size }} />,
  twitter: (size = 22) => <TwitterOutlined style={{ fontSize: size }} />,
  linkedin: (size = 22) => <LinkedinOutlined style={{ fontSize: size }} />,
  tiktok: (size = 22) => <IoLogoTiktok size={size} />,
};
