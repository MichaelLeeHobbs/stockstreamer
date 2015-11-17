app.directive('plusOne', function(){
	return {
		restrict: 'E',
		scope: {},
		templaeUrl: 'js/directives/plusOne.html',
		link: function(scope, element, atts){
			scope.like = function() {
				element.togleClass('btn-like');
			}
		}
	};
});
