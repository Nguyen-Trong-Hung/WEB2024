import { useContext } from "react";
import SearchBar from '../../components/searchBar/SearchBar';
import './homePage.scss';
import { AuthContext } from "../../context/AuthContext";

function HomePage(){

  const {currentUser} = useContext(AuthContext)

  console.log(currentUser);
  return (
    <div className='homePage'>
        <div className="textContainer">
            <div className="wrapper">
                <h1 className='title'>Nơi tìm kiếm địa điểm mơ ước của bạn</h1>
                <h4>Web Estate là nền tảng tiên phong giúp bạn dễ dàng tìm kiếm và sở hữu ngôi nhà lý tưởng. Chúng tôi mang đến hàng 
                    ngàn lựa chọn bất động sản, từ căn hộ tiện nghi giữa lòng thành phố đến những ngôi nhà yên bình ở vùng ngoại ô. 
                    Với giao diện thân thiện và công cụ tìm kiếm mạnh mẽ, Web Estate cam kết mang lại trải nghiệm tìm kiếm hoàn hảo, 
                    giúp bạn nhanh chóng tìm thấy nơi mà bạn luôn mơ ước. Dù bạn muốn mua hay thuê, hãy để Web Estate đồng hành cùng bạn 
                    trên hành trình tìm kiếm ngôi nhà hoàn hảo.</h4>
                <SearchBar/>
                <div className="boxes">
                    <div className="box">
                        <h1>16+</h1>
                        <h2>Năm kinh nghiệm</h2>
                    </div>

                    <div className="box">
                        <h1>100</h1>
                        <h2>Giải thưởng đạt được</h2>
                    </div>

                    <div className="box">
                        <h1>1000+</h1>
                        <h2>Lựa chọn</h2>
                    </div>
                </div>
            </div>
        </div>
        <div className="imgContainer">
            <img src="/bg.png" alt="" />
        </div>
    </div>
  )
}

export default HomePage