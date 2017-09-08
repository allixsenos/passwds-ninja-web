/*
    cvc ~= 11.08-bits of entropy per group: log(19*6*19)/log(2) ~= 11.08
    99 ~= 6.64-bits of entropy: 2*log(10)/log(2)
    Cvccvc99 ~= 11.08+11.08+6.64 = 28.80-bits of entropy

    Best practice is 70-bits of entropy. Thus:

    Cvccvccvccvccvccvc99 reaches the requirement
    (11.08+11.08+11.08+11.08+11.08+11.08+6.64) = 73.12-bits of entropy
*/
var template = 'Cvccvccvccvccvccvc99'; // 20 characters

function unbiasedRandom(size) {
    var min;
    var rand = new Uint32Array(1);

    const mycrypto = window.crypto || window.msCrypto;

    size >>>= 0; // ensure `size' is a 32-bit integer

    // force the range of [`min', 2**32) to be a multiple of `size'
    min = (-size >>> 0) % size;

    do { mycrypto.getRandomValues(rand); } while (rand[0] < min);

    return rand[0] % size;
}

function generatePasswords(template, number) {
    var chars = {};
    chars['l'] = 'abcdefghijklmnoprstuvwxyz';
    chars['U'] = chars['l'].toUpperCase();
    chars['v'] = 'aeiouy';
    chars['V'] = chars['v'].toUpperCase();
    chars['c'] = 'bcdfghjklmnprstvwxz';
    chars['C'] = chars['c'].toUpperCase();
    chars['9'] = '0123456789';
    chars['#'] = '!@#$%^&*_-+=()[]{}';
    chars['a'] = chars['l'] + chars['9'];
    chars['A'] = chars['a'].toUpperCase();

    var i, c, possible;

    var passwords = [];
    for (i = 0; i < number; i++) {
        password = '';
        for (c = 0; c < template.length; c++) {
            possible = chars[template.charAt(c)];
            password += possible.charAt(unbiasedRandom(possible.length));
        }
        passwords.push(password);
    }

    return passwords;
}

function doPasswords() {
  passwords = generatePasswords(template, 10);

  var passwordlist = $("ul#passwords");
  $.each(passwords, function(i, password) {
      passwordlist.append($("<li>").text(password));
  });
}

doPasswords();

$('#passwords').on('click', 'li', function() {
  var range = document.createRange();  
  range.selectNode(this);  
  window.getSelection().addRange(range);  
    
  var successful = false;
  try {  
    // Now that we've selected the anchor text, execute the copy command  
    successful = document.execCommand('copy');  
  } catch(err) {  
    successful = false;
    // whatever
  }

  if (!successful) {
      prompt("Your browser does not support insta-copy. Sorry.", $(this).text());
  }

  mixpanel.track("Claimed password");

  // Remove the selections - NOTE: Should use
  // removeRange(range) when it is supported  
  window.getSelection().removeAllRanges();  
});

function disableSelect(e) { return false; }
function reEnable() { return true; }
document.onselectstart=disableSelect;
if (window.sidebar){
    document.onmousedown=disableSelect
    document.onclick=reEnable
}

$('.more').on('click', function() {
  $('#passwords li').remove();
  doPasswords();
  return false;
});
