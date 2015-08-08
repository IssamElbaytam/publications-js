(function(){
  angular.module('pub.documents', ['pub.documents.controllers', 'pub.documents.services', 'pub.documents.directives'])
    .config(pubDocumentsConfig);

  function pubDocumentsConfig($stateProvider) {
    $stateProvider
      .state('pub.documents', {
        url: '/documents',
        controller: 'DocumentsController',
        controllerAs: 'documentsController',
        templateUrl: '/views/documents/documents.html',
        resolve: {
          documents: (Restangular) => Restangular.all('documents').getList()
        }
      })
        .state('pub.documents.index', {
          url: '/all',
          controller: 'DocumentsIndexController',
          controllerAs: 'documentsIndexController',
          templateUrl: 'views/documents/index.html'
        })

        .state('pub.documents.document', {
          url: '/:documentId',
          controller: 'DocumentController',
          controllerAs: 'documentController',
          parent: 'pub.documents',
          abstract: true,
          templateUrl: '/views/documents/document.html',
          resolve: {
            doc: (Restangular, $stateParams) => Restangular.one('documents', $stateParams.documentId).get()
          }
        })
          .state('pub.documents.document.view', {
            url: '/view',
            views: {
              'document-canvas': {
                controller: 'DocumentCanvasController',
                controllerAs: 'documentCanvasController',
                templateUrl: '/views/documents/canvas.html'
              }
            }
          });
    }
}());
