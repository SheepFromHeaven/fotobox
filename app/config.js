module.exports = {
  printer: {
    enabled: true,
    name: 'Canon_CP910'
  },
  imagePaths: {
    dest: `/mnt/usbstorage/fotobox`,
    mask: `${__dirname}/mask.png`,
    mock: `${__dirname}/mock/mock.jpeg`
  },
  imageWidth: 2400,
  imageHeight: 1600
};
