$(function(){
  const $getToken = $('#get_token');

  function getToken(){
    console.log('getToken');
  }

  $getToken.on('click.get', function(){
    getToken();
  });
});
