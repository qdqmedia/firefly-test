require.config({
  paths: {
    jquery: 'vendor/jquery/jquery',
    lodash:'vendor/lodash/lodash',
    firefly: 'firefly'
  }
});
 
require(['app', 'jquery', 'lodash', 'firefly'], function(app, $, _) {
  // use app here
  console.log(app);
  $(function(){
    $(document).on('click', '#startCobrowse', function(){
      showFirefly($('#token').val());
    });
  });
});
