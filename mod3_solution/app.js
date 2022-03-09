(function () {
'use strict';

	angular.module('NarrowItDownApp', [])
	.controller('NarrowItDownController', NarrowItDownController)
	.service('MenuSearchService', MenuSearchService)
	.directive('foundItems', FoundItemsDirective);

	function FoundItemsDirective () {
		let ddo = {
			templateUrl: 'found_items.html',
			scope: {
				items: '<',
				onRemove: '&'
			}
		};

		return ddo;
	}

	NarrowItDownController.$inject = ['MenuSearchService'];

	function NarrowItDownController (MenuSearchService) {
		let narrow = this;

		narrow.searchTerm = '';
		narrow.found = [];
		narrow.findItems = function () {
			let promise = MenuSearchService.getMatchedMenuItems(narrow.searchTerm);

			promise.then(function (response) {
				narrow.found = response;
			});
		}

		narrow.removeItem = function (index) {
			narrow.found.splice(index, 1);
		};
	}

	MenuSearchService.$inject = ['$http'];

	function MenuSearchService ($http) {
		let service = this;

		service.getMatchedMenuItems = function (searchTerm) {
			return $http({
				method: 'GET',
				url: 'https://davids-restaurant.herokuapp.com/menu_items.json'
			}).then(function (response) {
				let foundItems = [];
				let data = response.data;
				for (let i = 0; i < data.menu_items.length; i++) {
					if (data.menu_items[i].description.includes(searchTerm)) {
						foundItems.push(data.menu_items[i]);
					}
				}
				return foundItems;
			});
		};



	}
})();