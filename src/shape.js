export class Shape {

    idGen(){
      var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      return randLetter + Date.now();
    }

    constructor(ctx,options) {
      this.ctx = ctx;
      this.options = options
      this.elements = new Map()
      this.m = [1,0,0,1,0,0]
      // this.ctx.transform(this.m[0],this.m[1],this.m[2],this.m[3],this.m[4],this.m[5])
    }

    getElements(){
      return this.elements
    }

    setElements(elements){
      this.elements = elements
    }

    style(options){
      if(!this.ctx){
        return
      }
      if(options){
        for (let [key, value] of Object.entries(options)) {
          if(key in this.ctx){
            this.ctx[key] = value
          }
        }
      }
    }

    rectangle(x,y,w,h,options,dimensions){
      if(!this.ctx || !x || !y){
        return;
      }

      let config= {
        x: x,
        y: y,
        w: w,
        h: h          
      }

      this.style(options)

      this.ctx.save()
      if(dimensions && (dimensions.offsetX || dimensions.offsetY)){
        this.ctx.translate(dimensions.offsetX,dimensions.offsetY)
        config.x += dimensions.offsetX
        config.y += dimensions.offsetY

      }

      this.type = "rectangle"
      
      this.ctx.beginPath()
      this.ctx.strokeRect(x,y,w,h)

      this.ctx.restore()

      const ele = {
        id:this.idGen(),
        type: this.type,
        dimensions: config,
        options: (options ? options : this.options),
      }
    
      return ele
    }

    line(x1,y1,x2,y2,options,dimensions){
      
      if(!this.ctx){
        return
      }
      this.x1 = x1
      this.x2 = x2
      this.y1 = y1
      this.y2 = y2

      this.type = "line"
      this.style(options)

      let config= {
        x: Math.min(x1,x2),
        y: Math.min(y1,y2),
        w: Math.abs(x2-x1),
        h: Math.abs(y2-y1)
      }

      this.ctx.save()

      if(dimensions && (dimensions.offsetX || dimensions.offsetY)){
        this.ctx.translate(dimensions.offsetX,dimensions.offsetY)
        config.x += dimensions.offsetX
        config.y += dimensions.offsetY

      }

      
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.closePath()
      this.ctx.stroke()

      this.ctx.restore()

      const ele =  {
        id:this.idGen(),
        x1:this.x1,
        y1: this.y1,
        x2:this.x2,
        y2:this.y2,
        type: this.type,
        dimensions: config,
        options: (options ? options : this.options)
      }

      return ele
      
    }

    draw(elements){

      elements.forEach((el, key) => {
        if(!el){
              return
            }
            const shape = el.type
    
            switch(shape){
              case "rectangle":
                const rect = this.rectangle(el.dimensions.x,el.dimensions.y,el.dimensions.w,el.dimensions.h,el.options,el.dimensions)
                return rect
              case "line":
                const line = this.line(el.x1,el.y1,el.x2,el.y2,el.options,el.dimensions)
                return line  
              default:
                return
            }


      });

      // elements.map((el, i) => {
      //   if(!el){
      //     return
      //   }
      //   const shape = el.type

      //   switch(shape){
      //     case "rectangle":
      //       const rect = this.rectangle(el.x1,el.y1,el.x2,el.y2,el.options)
      //       return rect
      //     case "line":
      //       return this.line(el.x1,el.y1,el.x2,el.y2,el.options)
      //     case "circle":
      //       return this.circle(el.x1,el.y1,el.radius,el.options)
      //     case "ellipse":
      //       return this.ellipse(el.x1,el.y1,el.x2,el.y2,el.options)
      //     case "polygon":
      //       return this.polygon(el.points,el.options)
      //     case "svg":
      //       this.ctx.save()
      //       const ele = this.svg(el.path,el.pointsArr,el.options,el.resize)
      //       this.ctx.restore()
      //       return ele
      //     case "text":
      //       return this.textBox(el.x,el.y,el.text,el.options,el.width)

      //     default:
      //       return
      //   }

      // })
    }

    move(element, x, y){

      this.ctx.save()
      this.draw([element])
      this.ctx.restore()

    }

    scale(element,x,y){
      this.ctx.save()

      this.ctx.transform(0.5,0,0,1,0,0)

      const temp = this.draw([element])

      this.ctx.restore()
    }

}