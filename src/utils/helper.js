import { format } from "date-fns";
import Icon from "../components/common/Icon";

export function getFormatedDate(date, formatType = "yyyy-MM-dd") {
  return format(date, formatType);
}

export const wait = (time) => {
  return new Promise((res) => {
    setTimeout(res, time * 1000);
  });
};
export const getAvatarBorderColor = (rank) => {
  if (rank === 1) return "border-yellow-500";
  if (rank === 2) return "border-gray-400";
  if (rank === 3) return "border-orange-400";
  return "border-gray-200";
};

export const getMedalIcon = (rank) => {
  if (rank === 1) return <Icon className="w-12 h-12" name={"first_medal"} />;
  if (rank === 2) return <Icon className="w-12 h-12" name={"second_medal"} />;
  if (rank === 3) return <Icon className="w-12 h-12" name={"third_medal"} />;
  return null;
};
