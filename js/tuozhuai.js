window.onload = function() {
		var oUl= document.getElementById("drag_div");
		var aLi = oUl.getElementsByTagName('div');
		var disX = 0;
		var disY = 0;
		var minZindex = 1;
		var aPos =[];
		for(var i=0;i<aLi.length;i++){
			var t = aLi[i].offsetTop;
			var l = aLi[i].offsetLeft;
			aLi[i].style.top = t+"px";
			aLi[i].style.left = l+"px";
			aPos[i] = {left:l,top:t};
			aLi[i].index = i;
		}
		for(var i=0;i<aLi.length;i++){
			aLi[i].style.position = "absolute";
			aLi[i].style.margin = 0;
			setDrag(aLi[i]);
		}
		//拖拽
		var startPos = 0,endPos = 0,isScrolling = 0;
		function setDrag(obj){			
			obj.addEventListener('touchstart',function(){
				obj.style.cursor = "move";
			},false);
			obj.addEventListener('touchstart',function(event){
				console.log("1");
				var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
				var scrollLeft = document.documentElement.scrollLeft||document.body.scrollLeft;
				obj.style.zIndex = minZindex++;
				//当鼠标按下时计算鼠标与拖拽对象的距离
				disX = event.touches[0].clientX +scrollLeft-obj.offsetLeft;
				disY = event.touches[0].clientY +scrollTop-obj.offsetTop;
				obj.addEventListener('touchmove',function(event){
					//当有多个手指时，禁止拖动
					if(event.targetTouches.length > 1 || event.scale && event.scale !== 1) return;
				        var touch = event.targetTouches[0];
				        endPos = {x:touch.pageX - startPos.x,y:touch.pageY - startPos.y};
				        isScrolling = Math.abs(endPos.x) < Math.abs(endPos.y) ? 1:0; //isScrolling为1时，表示纵向滑动，0为横向滑动
				        if(isScrolling === 1){
				            // alert(0);
				            event.preventDefault(); //阻止触摸事件的默认行为，即阻止滚屏
				        }
					//当鼠标拖动时计算div的位置
					var l = event.touches[0].clientX -disX +scrollLeft;
					var t = event.touches[0].clientY -disY + scrollTop;
					obj.style.left = l + "px";
					obj.style.top = t + "px";
					/*for(var i=0;i<aLi.length;i++){
						aLi[i].className = "";
						if(obj==aLi[i])continue;//如果是自己则跳过自己不加红色虚线
						if(colTest(obj,aLi[i])){
							aLi[i].className = "active";
						}
					}*/
					for(var i=0;i<aLi.length;i++){
						aLi[i].className = aLi[i].className;
					}
					var oNear = findMin(obj);
					
					
					if(oNear){
						//oNear.className = "active";
					}
				},false);
				obj.addEventListener('touchend',function(){
					document.onmousemove = null;//当鼠标弹起时移出移动事件
					document.onmouseup = null;//移出up事件，清空内存
					//检测是否普碰上，在交换位置
					var oNear = findMin(obj);
					if(oNear){
						var width1=oNear.clientWidth;
						var height1=oNear.clientHeight;
						var width2=obj.clientWidth;
						var height2=obj.clientHeight;
						console.log(width1+width2)
                        console.log(oNear.className);
                         console.log(obj.className)
                         var className1=obj.className;
                         var className2=oNear.className;
						obj.className=className2;
						oNear.className=className1;
						oNear.style.zIndex = minZindex++;
						obj.style.zIndex = minZindex++;
						startMove(oNear,aPos[obj.index]);
						startMove(obj,aPos[oNear.index]);
						//交换index
						oNear.index += obj.index;
						obj.index = oNear.index - obj.index;
						oNear.index = oNear.index - obj.index;
						
						
						obj.clientWidth=width2;
						obj.clientHeight=height2;
						
						oNear.clientWidth=width1;
						oNear.clientHeight=height1;
						
					}else{

						startMove(obj,aPos[obj.index]);
					}
				},false)
				clearInterval(obj.timer);
				return false;//低版本出现禁止符号
			},false)
		}
		//碰撞检测
		function colTest(obj1,obj2){
			var t1 = obj1.offsetTop;
			var r1 = obj1.offsetWidth+obj1.offsetLeft;
			var b1 = obj1.offsetHeight+obj1.offsetTop;
			var l1 = obj1.offsetLeft;

			var t2 = obj2.offsetTop;
			var r2 = obj2.offsetWidth+obj2.offsetLeft;
			var b2 = obj2.offsetHeight+obj2.offsetTop;
			var l2 = obj2.offsetLeft;

			if(t1>b2||r1<l2||b1<t2||l1>r2){
				return false;
			}else{
				return true;
			}
		}
		//勾股定理求距离
		function getDis(obj1,obj2){
			var a = obj1.offsetLeft-obj2.offsetLeft;
			var b = obj1.offsetTop-obj2.offsetTop;
			return Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
		}
		//找到距离最近的
		function findMin(obj){
			var minDis = 999999999;
			var minIndex = -1;
			for(var i=0;i<aLi.length;i++){
				if(obj==aLi[i])continue;
				if(colTest(obj,aLi[i])){
					var dis = getDis(obj,aLi[i]);
					if(dis<minDis){
						minDis = dis;
						minIndex = i;
					}
				}
			}
			if(minIndex==-1){
				return null;
			}else{
				return aLi[minIndex];
			}
		}	
	}