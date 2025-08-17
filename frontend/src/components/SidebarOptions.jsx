import React from "react";
import { Add } from "@material-ui/icons";
import "./css/SidebarOptions.css";

function SidebarOptions({ onCategoryClick }) {
  const categories = [
    { name: "History", img: "https://cdn.pixabay.com/photo/2014/01/18/10/14/vaulted-cellar-247391_640.jpg" },
    { name: "Business", img: "https://media.istockphoto.com/id/1350415370/photo/partnership-multi-exposure-of-investor-businessman-handshake-with-partner-for-successful.jpg?s=2048x2048&w=is&k=20&c=Q6CFBhfj3-XRT-NZ26RTXJPgrpLCr0WoDPw1Iw5SGls=" },
    { name: "Psychology", img: "https://cdn.pixabay.com/photo/2014/11/24/18/50/mind-544404_1280.png" },
    { name: "Cooking", img: "https://cdn.pixabay.com/photo/2016/11/21/16/03/campfire-1846142_1280.jpg" },
    { name: "Music", img: "https://cdn.pixabay.com/photo/2020/05/01/14/15/music-sheet-5117328_1280.jpg" },
    { name: "Science", img: "https://cdn.pixabay.com/photo/2020/05/07/19/21/cosmonaut-5142852_1280.jpg" },
    { name: "Health", img: "https://cdn.pixabay.com/photo/2017/07/02/19/24/dumbbells-2465478_640.jpg" },
    { name: "Movies", img: "https://cdn.pixabay.com/photo/2017/03/13/17/25/clapper-2140602_1280.jpg" },
    { name: "Technology", img: "https://cdn.pixabay.com/photo/2021/10/11/16/00/robot-6701139_1280.jpg", },
    { name: "Education", img: "https://cdn.pixabay.com/photo/2016/11/14/03/16/book-1822474_1280.jpg", }
  ];

  return (
    <div className="sidebarOptions">
      {categories.map((cat) => (
        <div
          key={cat.name}
          className="sidebarOption"
          onClick={() => onCategoryClick(cat.name)}
        >
          <img src={cat.img} alt={cat.name} />
          <p>{cat.name}</p>
        </div>
      ))}

      <div className="sidebarOption">
        <Add />
        <p className="text">Discover Spaces</p>
      </div>
    </div>
  );
}

export default SidebarOptions;
