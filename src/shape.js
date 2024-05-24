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