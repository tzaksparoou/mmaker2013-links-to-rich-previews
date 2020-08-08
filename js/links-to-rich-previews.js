let richPreviewTemplate = `
    <div class="rich-preview">  
        <div class="rich-preview-image">    
            <a href="https://sub.domain.com/link-one" target="_blank" class="rich">      
                <img src="https://sub.domain.com/image-for-link-one.png">    
            </a>  
        </div>  
        <div class="rich-preview-link">   
            <a href="https://sub.domain.com/link-one" target="_blank" class="rich">Page Title Goes Here</a>  
        </div>
    </div>
    `;


async function updateLink(link) {
    $.ajax({
        type: 'GET',
        url: 'http://www.whateverorigin.org/get?url=' + encodeURIComponent(link) + '&callback=?',
        dataType: 'json',
        success: function (data) {
            htmlResponse = data.contents;
            let htmlDoc = $.parseHTML($.trim(htmlResponse));
            const title = $(htmlDoc).filter('meta[property="og:title"]').attr('content');
            // console.log(title);
            const imageUrl = $(htmlDoc).filter('meta[property="og:image"]').attr('content');
            // console.log(imageUrl);
            if(title && imageUrl){
                appendRichPreview(link, title, imageUrl);
            }
        }
    });
}

function getPageLinks() {
    const links = $('a[href*="/via.giftmoji.com/"]:not(".rich")')
    // .not('.rich');
    return links;
}

function appendRichPreview(link, title, imageUrl) {
    let richPreview =
        $(richPreviewTemplate)
            .find('div.rich-preview-image a.rich').attr('href', link).end()
            .find('a.rich img').attr('src', imageUrl).end()
            .find('div.rich-preview-link a').attr('href', link).text(title).end()
    console.log(richPreview);
    $(link).replaceWith(richPreview);
}


$(document).ready(function () {
    setInterval(function () {
        const links = getPageLinks();
        console.log(links)
        for (let i = 0; i < links.length; i++) {
            updateLink(links[i])
        }
    },2000);
    
});