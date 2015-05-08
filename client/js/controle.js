  function ChatController($scope) {
        var socket = io.connect();
        $scope.roster = [];
        $scope.name = '';
        $scope.text = '';
        $scope.light = new FSS.Light('#333333', '#AE0418');
        $scope.usuario = {"usuarioX":0,"usuarioY":0,"light": $scope.light, "id" : ""};
        $scope.luzes = [];
        
        socket.on('connect', function () {
          $scope.setUsuario();
        });

        socket.on('roster', function (names) {
          $scope.roster = names;
          $scope.$apply();
        });

        $(document).mousemove(function(e) {
          $scope.usuario = {"usuarioX": e.pageX,"usuarioY": e.pageY , "light": $scope.light, "id":socket.socket.sessionid};
          $scope.usuario.light.setPosition(e.pageX-(container.offsetWidth/2),- e.pageY+(container.offsetHeight/2), 60);
          $scope.setUsuario();
        });

        $scope.setUsuario = function setUsuario() {
          socket.emit('novoUser', $scope.usuario);
          for(var i = 0 ; i < $scope.roster.length ; i++){
            if($scope.luzes.indexOf($scope.roster[i].id) == -1 && $scope.roster[i].id!= undefined && $scope.roster[i].id!= "" ){
              var luz = $.extend(new FSS.Light(), $scope.roster[i].light);
              $scope.luzes.push($scope.roster[i].id);
              $scope.luzes.push(luz);
              scene.add(luz);
             
            }else{
              if($scope.roster[i].id!= undefined && $scope.roster[i].id!= "" ){
                var pos = $scope.luzes.indexOf($scope.roster[i].id)+1;
                var luz = $.extend(new FSS.Light(), $scope.roster[i].light);
                $scope.luzes[pos].setPosition($scope.roster[i].usuarioX-(container.offsetWidth/2),- $scope.roster[i].usuarioY+(container.offsetHeight/2), 60);
              }
            }
          }
          // REMOVE USUARIOS QUE SAIRAM
          if($scope.luzes.length > $scope.roster.length*2 ){
            for(var i = 0 ; i < $scope.luzes.length ; i = i + 2){
              if($scope.roster.indexOf($scope.luzes[i])==-1){
                $scope.luzes.splice(i, 2);
                scene.lights.splice((i/2),1);
              }  
            }
          }
        };
        socket.emit('novoUser', $scope.usuario);
      }