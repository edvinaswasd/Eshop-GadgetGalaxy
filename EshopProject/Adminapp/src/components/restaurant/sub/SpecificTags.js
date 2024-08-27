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
  return (
    <Fragment>
      {
        <Grid  xs={12} sm={12} md={12} container>
          <Grid xs={12} sm={12} md={12} item>
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
                  Menu Tags
                </Box>
              </Typography>
            </div>
          </Grid>

          <Grid xs={12} sm={12} md={12} item>
            <FormControl>
              <FormGroup row>
                {tags.map((tag) => (
                  // <Grid item xs={12} sm={12} md={3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="menuTags"
                        value={tag._id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    }
                    label={tag.name.toLowerCase()}
                    key={tag._id}
                    checked={values.menuTags.includes(tag._id)}
                  />
                  // </Grid>
                ))}
              </FormGroup>
            </FormControl>
          </Grid>
        </Grid>
      }
    </Fragment>
  );
}
