import React from "react";
import { Button } from "@material-ui/core";
import axios from "axios"

export default function ImageUpload() {
  const handleImageAsFile = async (e) => {
    try {
      const image = e.target.files[0];
    
      const data = new FormData();
      const images = [];
      images.push(image)
      data.append("name",'pathum')
      data.append("photos",images)
      data.append("logo",image)

      await axios.post(`/restaurant/image`,data);


    } catch (error) {
      console.error(error);
    } finally {
     
    }
    // setImageAsFile(imageFile => (image))
  };
  return (
    <div>
      <label htmlFor="upload-photo">
        <input
          style={{ display: "none" }}
          id="upload-photo"
          name="upload-photo"
          type="file"
          accept="image/jpeg,image/gif,image/png,application/pdf,image/x-eps"
          onChange={(e) => {
            e.persist();
            handleImageAsFile(e);
          }}
        />

        <Button
          color="secondary"
          variant="contained"
          component="span"
          size="small"
        >
          Logo
        </Button>
      </label>
    </div>
  );
}
