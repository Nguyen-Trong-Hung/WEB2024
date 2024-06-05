import { useState } from "react";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";

function NewPostPage() {
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    // Kiểm tra dữ liệu trước khi gửi yêu cầu
    if (
      !inputs.title ||
      !inputs.price ||
      !inputs.address ||
      !inputs.city ||
      !inputs.bedroom ||
      !inputs.bathroom ||
      !inputs.type ||
      !inputs.property ||
      !inputs.latitude ||
      !inputs.longitude ||
      images.length === 0 ||
      !value ||
      !inputs.utilities ||
      !inputs.pet
    ) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          type: inputs.type,
          property: inputs.property,
          latitude: inputs.latitude,
          longitude: inputs.longitude,
          images: images,
        },
        postDetail: {
          desc: value,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          size: parseInt(inputs.size),
          school: parseInt(inputs.school),
          bus: parseInt(inputs.bus),
          restaurant: parseInt(inputs.restaurant),
        },
      });
      navigate("/" + res.data.id);
    } catch (err) {
      console.log(err);
      setError("Đã xảy ra lỗi khi thêm bài viết!");
    }
  };

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Thêm bài mới</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Tiêu đề</label>
              <input id="title" name="title" type="text" />
            </div>
            <div className="item">
              <label htmlFor="price">Giá</label>
              <input id="price" name="price" type="number" />
            </div>
            <div className="item">
              <label htmlFor="address">Địa chỉ</label>
              <input id="address" name="address" type="text" />
            </div>
            <div className="item description">
              <label htmlFor="desc">Miêu tả</label>
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </div>
            <div className="item">
              <label htmlFor="city">Thành phố</label>
              <input id="city" name="city" type="text" />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Số phòng ngủ</label>
              <input min={1} id="bedroom" name="bedroom" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Số phòng tắm</label>
              <input min={1} id="bathroom" name="bathroom" type="number" />
            </div>
            <div className="item">
              <label htmlFor="latitude">Vĩ độ</label>
              <input id="latitude" name="latitude" type="text" />
            </div>
            <div className="item">
              <label htmlFor="longitude">Kinh độ</label>
              <input id="longitude" name="longitude" type="text" />
            </div>
            <div className="item">
              <label htmlFor="type">Phương thức</label>
              <select name="type">
                <option value="rent" defaultChecked>
                  Mượn
                </option>
                <option value="buy">Mua</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="property">Loại</label>
              <select name="property">
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="utilities">Chính sách tiện ích</label>
              <select name="utilities">
                <option value="owner">Chủ sở hữu chịu trách nhiệm</option>
                <option value="tenant">Người thuê nhà có trách nhiệm</option>
                <option value="shared">Trách nhiệm chung</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">Chính sách nuôi thú cưng</label>
              <select name="pet">
                <option value="allowed">Cho phép</option>
                <option value="not-allowed">Không cho phép</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">Tài chính</label>
              <input
                id="income"
                name="income"
                type="text"
                placeholder="Tài chính"
              />
            </div>
            <div className="item">
              <label htmlFor="size">Tổng diện tích (m2)</label>
              <input min={0} id="size" name="size" type="number" />
            </div>
            <div className="item">
              <label htmlFor="school">Trường học</label>
              <input min={0} id="school" name="school" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bus">Trạm xe bus</label>
              <input min={0} id="bus" name="bus" type="number" />
            </div>
            <div className="item">
              <label htmlFor="restaurant">Nhà hàng</label>
              <input min={0} id="restaurant" name="restaurant" type="number" />
            </div>
            <button className="sendButton">Đăng bài</button>
            {error && <span>{error}</span>}
          </form>
        </div>
      </div>
      <div className="sideContainer">
        {images.map((image, index) => (
          <img src={image} key={index} alt="" />
        ))}
        <UploadWidget
          uwConfig={{
            multiple: true,
            cloudName: "da6cjk6qy",
            uploadPreset: "estate",
            folder: "posts",
          }}
          setState={setImages}
        />
      </div>
    </div>
  );
}

export default NewPostPage;
