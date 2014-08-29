describe("User Controller Tests",function(){
	beforeEach(module("gradame"))
	var scope,controller,auth;

	beforeEach(inject(function($controller,$rootScope,Auth){
		auth = Auth;
		scope = $rootScope.$new();
			controller = $controller('UserCtrl',{
				$scope:scope
			});
	scope.user = {hash: "7f29f52eef1a6e9e8133777d4946087e", email: "emonidi@gmail.com", full_name: "Emilian Gospodinov"};
	spyOn(scope,"redirect")
	}))


	it('should ensure that scope exists',function(){
		expect(typeof scope).toBe('object');
	});


	it('should ensure that scope.user exits',function(){
		expect(scope.user).toBeDefined();
	})

	it('should ensure that scope.user has properties',function(){
		expect(scope.user.full_name).toBeDefined();
	});

	it('should userExists',function(){
		spyOn(scope,'userExists').andCallTrhough()

		expect(scope.userExists).toHaveBeenCalled()
	})

	it('ensures that scope.redirect is called',function(){

		expect(scope.redirect).toHaveBeenCalled()
	})

})