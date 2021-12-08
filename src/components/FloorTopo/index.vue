<!-- -楼层拓扑 -->
<template>
  <div class="index" ref="floorMap"></div>
</template>

<script>
import VectorSource from 'ol/source/Vector'
import {Vector as VectorLayer} from 'ol/layer'
import Projection from 'ol/proj/Projection'
import {Map, View} from 'ol'
import ImageLayer from 'ol/layer/Image'
import Static from 'ol/source/ImageStatic'
import {getCenter} from 'ol/extent'
import Point from 'ol/geom/Point'
import Feature from 'ol/Feature'
import Style from 'ol/style/Style'
import Icon from 'ol/style/Icon'
import Text from 'ol/style/Text'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import DoubleClickZoom from 'ol/interaction/DoubleClickZoom'
import Select from 'ol/interaction/Select'
import Circle from 'ol/style/Circle'
import {defaults as control} from 'ol/control'
import {GeoJSON} from 'ol/format'

export default {
  name: "index",
  props: {
    dianList: {
      type: Array,
      default() {
        return []
      }
    },
    time: {
      type: Number,
      default: 0
    },
    backImage: {
      type: String,
      default: '/storage/map-bg.png'
    },
    height: {
      type: Number
    },
    width: {
      type: Number
    },
    screen: Boolean
  },
  watch: {
    dianList: {
      deep: true,
      handler() {
        // this.initData()
      },
    },
    time: {//时间变化就改变地图大小
      handler() {
        if (this.map) {
          // this.map.updateSize()
        }
      },
    },
  },
  data() {
    return {
      vectorLayer: null,
      vectorSource: null,
      map: null,
      num: 0,
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    /*初始化地图*/
    initMap() {
      this.vectorSource = new VectorSource({});
      this.vectorLayer = new VectorLayer({
        source: this.vectorSource,
      });
      const mapContainer = this.$refs.floorMap
      const margin = 50
      const extent = [0, 0, this.width, this.height]
      const projection = new Projection({
        code: 'xkcd-image',
        units: 'pixels',
        extent: extent,
      });
      const map = new Map({
        controls: control({zoom: false, rotate: false}),//隐藏左上角放大缩小按钮,隐藏指北按钮
        layers: [new ImageLayer({
          source: new Static({//用静态图片作为背景
            url: this.backImage,
            projection: projection,
            imageExtent: extent,
          }),
        })],
        target: mapContainer,
        view: new View({
          projection: projection,
          center: getCenter(extent),
          zoom: 0,
          maxZoom: 3,
          minZoom: 0,
          showFullExtent: true,//把限制区域显示在视图中间
          extent: [-margin, -margin, this.width + margin, this.height + margin],
          // extent: extent,
        }),
      })
      /*限制双击地图放大的事件*/
      const dblClickInteraction = map
        .getInteractions()
        .getArray()
        .find(interaction => {
          return interaction instanceof DoubleClickZoom;
        });
      map.removeInteraction(dblClickInteraction);
      this.map = map
      // map.getView().adjustResolution(2)
      /*添加透明图层*/
      const obj = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [-8e6, -8e6],
                [-8e6, 8e6],
                [8e6, 8e6],
                [8e6, -8e6],
              ]],
            },
          },
        ],
      }
      const source = new VectorSource({
        features: new GeoJSON().readFeatures(obj),
      })
      const r = new VectorLayer({
        source: source,
        style: new Style({
          fill: new Fill({
            color: 'rgb(4,31,58,0.8)',
          }),
          stroke: new Stroke({
            color: 'rgb(4,31,58,0.8)',
            width: 1,
          }),
          image: new Circle({
            radius: 7,
            fill: new Fill({
              color: 'rgb(4,31,58,0.8)',
            }),
          }),
        }),
      });

      //提前创建图标
      const aioCamera = new Icon({
        src: '/storage/camera_aioCamera_mini_br.png',
        scale: 0.5,
      })
      const aioCamera_error = new Icon({
        src: '/storage/camera_aioCamera_mini_error_br.png',
        scale: 0.5,
      })
      const domeCamera = new Icon({
        src: '/storage/camera_domeCamera_mini_br.png',
        scale: 0.5,
      })
      const domeCamera_error = new Icon({
        src: '/storage/camera_domeCamera_mini_error_br.png',
        scale: 0.5,
      })
      const hsdCamera = new Icon({
        src: '/storage/camera_hsdCamera_mini_br.png',
        scale: 0.5,
      })
      const hsdCamera_error = new Icon({
        src: '/storage/camera_hsdCamera_mini_error_br.png',
        scale: 0.5,
      })
      const shootCamera = new Icon({
        src: '/storage/camera_shootCamera_mini_br.png',
        scale: 0.5,
      })
      const shootCamera_error = new Icon({
        src: '/storage/camera_shootCamera_mini_error_br.png',
        scale: 0.5,
      })


      const center = new Icon({
        src: '/storage/camera_center_mini_br.png',
        scale: 0.5,
      })
      const center_error = new Icon({
        src: '/storage/camera_center_mini_error_br.png',
        scale: 0.5,
      })
      const wsd = new Icon({
        src: '/storage/camera_wsd_mini_br.png',
        scale: 0.5,
      })
      const wsd_error = new Icon({
        src: '/storage/camera_wsd_mini_error_br.png',
        scale: 0.5,
      })
      const menchuang = new Icon({
        src: '/storage/camera_menchuang_mini_br.png',
        scale: 0.5,
      })
      const menchuang_error = new Icon({
        src: '/storage/camera_menchuang_mini_error_br.png',
        scale: 0.5,
      })
      const zhiwen = new Icon({
        src: '/storage/camera_zhiwen_mini_br.png',
        scale: 0.5,
      })
      const zhiwen_error = new Icon({
        src: '/storage/camera_zhiwen_mini_error_br.png',
        scale: 0.5,
      })
      const liangdu = new Icon({
        src: '/storage/camera_liangdu_mini_br.png',
        scale: 0.5,
      })
      const liangdu_error = new Icon({
        src: '/storage/camera_liangdu_mini_error_br.png',
        scale: 0.5,
      })
      const renti = new Icon({
        src: '/storage/camera_renti_mini_br.png',
        scale: 0.5,
      })
      const renti_error = new Icon({
        src: '/storage/camera_renti_mini_error_br.png',
        scale: 0.5,
      })
      const zhineng = new Icon({
        src: '/storage/camera_zhineng_mini_br.png',
        scale: 0.5,
      })
      const zhineng_error = new Icon({
        src: '/storage/camera_zhineng_mini_error_br.png',
        scale: 0.5,
      })
      const chuanglian = new Icon({
        src: '/storage/camera_chuanglian_mini_br.png',
        scale: 0.5,
      })
      const chuanglian_error = new Icon({
        src: '/storage/camera_chuanglian_mini_error_br.png',
        scale: 0.5,
      })
      const yanwu = new Icon({
        src: '/storage/camera_yanwu_mini_br.png',
        scale: 0.5,
      })
      const yanwu_error = new Icon({
        src: '/storage/camera_yanwu_mini_error_br.png',
        scale: 0.5,
      })
      const imgs = {
        aioCamera,
        aioCamera_error,
        domeCamera,
        domeCamera_error,
        hsdCamera,
        hsdCamera_error,
        shootCamera,
        shootCamera_error,
        center,
        center_error,
        wsd,
        wsd_error,
        menchuang,
        menchuang_error,
        zhiwen,
        zhiwen_error,
        liangdu,
        liangdu_error,
        renti,
        renti_error,
        zhineng,
        zhineng_error,
        chuanglian,
        chuanglian_error,
        yanwu,
        yanwu_error
      }
      /*选择图标*/
      let selectStyle = {};
      const select = new Select({
        // layers: [this.vectorLayer],
        style: function (feature) {
          // console.log(feature.getStyle());
          const properties = feature.getGeometry().getProperties()
          let src = null
          let color = ''
          if (properties.status === 0) {
            // src = '/storage/camera_' + properties.moType + '_mini_br.png'
            src = imgs[properties.moType]
            color = '#00FFF6'
          }
          if (properties.status === 1) {
            // src = '/storage/camera_' + properties.moType + '_mini_error_br.png'
            src = imgs[properties.moType + '_error']
            color = '#EB4251'
          }
          selectStyle = new Style({
            image: src,
            text: new Text({
              font: 'normal 12px 微软雅黑',
              text: properties.name + '\n' + properties.ip,
              fill: new Fill({
                color,
              }),
              stroke: new Stroke({
                color: '#092539',
                width: 1,
              }),
              offsetY: 34,
              scale: 1,
            }),
          })
          return selectStyle;
        },
      })

      if (this.screen) {
        // map.addLayer(r)
        map.addInteraction(select);
        /*鼠标移到上面改变手型*/
        map.on('pointermove', function (evt) {
          map.getTargetElement().style.cursor = map.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';
        });
        /*双击事件*/
        map.on('dblclick', (e) => {
          const pixel = map.getEventPixel(e.originalEvent)
          const features = map.forEachFeatureAtPixel(
            pixel,
            (feature) => {
              return feature
            },
            {hitTolerance: 1}
          )
          if (!features) {
            return
          }
          const properties = features.getGeometry().getProperties()
          if (properties && properties.moId) {
            this.$emit('dblclick', properties.moId, false, properties.moType)
          } else {
            this.$emit('dblclick', 0)
          }
        })
      }

      /*点击事件*/
      map.on('click', (e) => {
        const pixel = map.getEventPixel(e.originalEvent)
        const features = map.forEachFeatureAtPixel(
          pixel,
          (feature) => {
            return feature
          },
          {hitTolerance: 1}
        )
        if (!features) {
          return
        }
        const properties = features.getGeometry().getProperties()
        if (properties && properties.moId) {
          this.$emit('selectDian', properties.moId)
        } else {
          this.$emit('selectDian', 0)
        }
      })
      map.addLayer(this.vectorLayer);
      /* 数据加载 */
      this.initData()

    },
    initData() {
      this.num = 0
      this.removeDraw()
      this.dianList.forEach((v) => {
        this.setSource(v)
      })
    },
    setSource(v) {
      //当点没有坐标时,自动排列
      let loc = [50, 50]
      if (v.position) {
        loc = v.position.split(',')
      } else {
        const dianWidth = 100 //点的宽度
        const dianHeight = 100 //点的高度
        ////先根据宽度计算每排能容纳多少个点
        const x = Math.floor(this.width / dianWidth);
        //自动计算每个点的坐标
        loc = [(this.num % x) * dianWidth, Math.floor(this.num / x) * dianHeight]
        this.num++
      }
      // console.log(loc);
      const point = new Point(loc)
      point.setProperties(v)
      const iconFeature = new Feature({
        geometry: point,
        name: v.name,
        population: 4000,
        rainfall: 500,
      });
      let iconStyle = null
      if (this.screen) {
        let src = ''
        let color = ''
        if (v.status === 0) {
          src = '/storage/camera_' + v.moType + '_mini.png'
          color = '#00FFF6'
        }
        if (v.status === 1) {
          src = '/storage/camera_' + v.moType + '_mini_error.png'
          color = '#EB4251'
        }
        iconStyle = new Style({
          image: new Icon({
            src,
            scale: 0.5,
          }),
          text: new Text({
            font: 'normal 12px 微软雅黑',
            text: v.name + '\n' + v.ip,
            fill: new Fill({
              color,
            }),
            stroke: new Stroke({
              color: '#092539',
              width: 1,
            }),
            offsetY: 34,
            scale: this.screen ? 0 : 1,
          }),
        });
      } else {
        iconStyle = new Style({
          image: new Icon({
            src: '/storage/camera_' + v.moType + '.png',
            size: [60, 60],
            scale: 0.5,
          }),
          text: new Text({
            font: 'normal 12px 微软雅黑',
            text: v.name + '\n' + v.ip,
            fill: new Fill({
              color: '#000000',
            }),
            stroke: new Stroke({
              color: '#fff',
              width: 2,
            }),
            offsetY: 48,
            scale: this.screen ? 0 : 1,
          }),
        });
      }
      iconFeature.setStyle(iconStyle);
      this.vectorSource.addFeature(iconFeature)
    },
    /* 删除绘制的点 */
    removeDraw() {
      if (this.vectorLayer) {
        this.vectorLayer.getSource().clear()
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.index {
  width: 100%;
  height: 100%;
}
</style>
