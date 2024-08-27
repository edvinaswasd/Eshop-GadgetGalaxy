import React, { Fragment} from "react";
import {
  FormControlLabel,
  Checkbox,
  FormGroup,
  Box,
  Typography,
  Grid,
  FormControl,
} from "@material-ui/core";
export default function Tags({
  values,
  setFieldValue,
  handleChange,
  handleBlur,
  tags,
}) {
  const groupMasterTags = (tags) => {
    if (tags && tags.length) {
      const tagMasterNames = tags.map((tag) => tag.tagMaster.name);
      return [...new Set(tagMasterNames)];
    } else {
      return [];
    }
  };

  return (
    <Fragment>
      <div style={{ width: "100%" }}>
        <Typography component="div" bgcolor="#748ca3">
          <Box
            component="span"
            display="block"
            p={1}
            m={1}
            fontWeight="fontWeightMedium"
            fontFamily="Roboto"
          >
            Tags
          </Box>
        </Typography>
      </div>
      {groupMasterTags(tags).map((master) => (
        <Grid item xs={12} sm={12} md={12} container key={master}>
          <Grid xs={12} sm={12} md={12} item>
            <Typography variant="h6" component="h6" bgcolor="#748ca3">
              {master}
            </Typography>
          </Grid>
          <Grid xs={12} sm={12} md={12} item>
            <FormControl>
              <FormGroup row>
                {tags
                  .filter((tag) => tag.tagMaster.name === master)
                  .map((tag) => (
                    // <Grid item xs={12} sm={12} md={3}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="tags"
                          value={tag._id}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      }
                      label={tag.name.toLowerCase()}
                      key={tag._id}
                      checked={values.tags.includes(tag._id)}
                    />
                    // </Grid>
                  ))}
              </FormGroup>
            </FormControl>
          </Grid>
        </Grid>
      ))}
    </Fragment>
  );
}
