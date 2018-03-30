
class HttpRequest
{
    static get(url, data=null, success=null, fail=null)
    {
        let ajax = new XMLHttpRequest();
        if(data != null)
        {
            url = url + '?';

            //data是个json对象，将其转换成字符串
            let argustr = '';
            for(let attr in data)
            {
                argustr = argustr + attr + '=' + data[attr] + '&';
            }
            url = url + argustr;
            url = encodeURI(url);;
        }
        ajax.open('get', url, true);
        ajax.send();

        ajax.onreadystatechange = () => 
        {
            // 在事件中 获取数据 并修改界面显示
            if(ajax.readyState == 4) 
            {
                if(ajax.status == 200)
                {
                    if(success)
                    {
                        success(ajax.responseText);
                    }
                }
                else if(ajax.status == 404)
                {
                    if(fail)
                    {
                        fail("发生错误：" + ajax.status);
                    }
                }
            }
        }
    }

    static post(url, data=null, success=null, fail=null)
    {
        //创建异步对象  
        let ajax = new XMLHttpRequest();
        ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        ajax.open('post', url, true );
        if(data)
        {
            ajax.send(data);
        }
        else
        {
            ajax.send();
        }

        ajax.onreadystatechange = () => 
        {
            // 在事件中 获取数据 并修改界面显示
            if(ajax.readyState == 4) 
            {
                if(ajax.status == 200)
                {
                    if(success)
                    {
                        success(ajax.responseText);
                    }
                }
                else if(ajax.status == 404)
                {
                    if(fail)
                    {
                        fail("发生错误：" + ajax.status);
                    }
                }
            }
        };
    }
}

export default HttpRequest;