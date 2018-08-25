const Koa = require('koa');
const Router = require('koa-router');
const cheerio = require('cheerio');
const {
  discover,
  playlist,
  song
} = require('./module/myRequest');

const app = new Koa();
const router = new Router();

// 歌单列表
router.get('/', async ctx => {
  await discover().then(res => {
    const $ = cheerio.load(res);
    const cardsDom = Array.prototype.slice.call($('#discover-module ul.m-cvrlst.f-cb li'));
    // 歌单列表data
    const cardsListData = [];
    cardsDom.forEach(card => {
      const $$ = cheerio.load(card);
      cardsListData.push({
        thumb: $$('.u-cover img').attr('src'),
        title: $$('.u-cover a.msk').attr('title'),
        id: $$('.u-cover a.msk').attr('data-res-id'),
        // link: $$('.u-cover a.msk').attr('href'),
        count: $$('.u-cover span.nb').text(),
      })
    }, error => {
      ctx.body = {
        code: -1,
        data: error.stack || '数据获取失败'
      }
      return;
    });

    // banner data
    const pattern = /<script[^>]*>\s*window\.Gbanners\s*=\s*([^;]+?);\s*<\/script>/g;
    let banner = pattern.exec(res)[1];
    try {
      banner = eval(banner).map(b => {
        return {
          picUrl: b.picUrl,
          backgroundUrl: b.backgroundUrl
        }
      });
    } catch (error) {
      banner = []
    }

    ctx.body = {
      code: 1,
      data: {
        banner,
        playlist: cardsListData
      }
    };
  })
});

// 歌单列表
router.get('/playlist', async ctx => {
  const query = ctx.request.query;
  if (!query.id) {
    ctx.body = '参数缺失';
  }
  await playlist(query.id).then(res => {
    const $ = cheerio.load(res);
    const listDom = Array.prototype.slice.call($('#m-playlist ul.f-hide a'));
    const listData = [];
    listDom.forEach(song => {
      const $$ = cheerio.load(song);
      const songid = $$('a').attr('href').replace(/\/song\?id=(\d+)$/, `$1`);
      listData.push({
        title: $$('a').text(),
        songid,
        mp3: `http://music.163.com/song/media/outer/url?id=${songid}`
      })
    });

    ctx.body = {
      code: 1,
      data: listData
    };
  }, error => {
    ctx.body = {
      code: -1,
      data: error.stack || '数据获取失败'
    }
    return;
  });
})

// 歌曲详情
router.get('/song', async ctx => {
  const query = ctx.request.query;
  if (!query.id) {
    ctx.body = '参数缺失';
  }
  await song().then(res => {
    ctx.body = {
      code: -1,
      data: ''
    };
  })
});


// 路由
app.use(router.routes()).use(router.allowedMethods())

app.listen(3000, () => {
  console.log(`The server is running at http://127.0.0.1:3000`)
})