/* eslint-disable camelcase */
const axios = require("axios");

exports.facebook = async access_token => {
  const fields = "id, name, email";
  const url = "https://graph.facebook.com/me";
  const params = { access_token, fields };
  const response = await axios.get(url, { params });
  const { id, name, email } = response.data;
  return {
    service: "facebook",
    id,
    name,
    email
  };
};

exports.google = async access_token => {
  const url = "https://www.googleapis.com/oauth2/v3/userinfo";
  const params = { access_token };
  const response = await axios.get(url, { params });
  const { sub, name, email } = response.data;
  return {
    service: "google",
    id: sub,
    name,
    email
  };
};
