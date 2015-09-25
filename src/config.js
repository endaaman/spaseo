var config = null;
var getConfig = function (){
  return config;
}
module.exports = function (c){
  if (c) {
    config = c;
  }
  return config
}
