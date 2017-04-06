/* μlogger
 *
 * Copyright(C) 2017 Bartek Fabiszewski (www.fabiszewski.net)
 *
 * This is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Library General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU Library General Public
 * License along with this program; if not, write to the Free Software
 * Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
 */

function changePass() {
  var form = '<form id="passForm" method="post" onsubmit="submitPass(); return false">';
  form += '<label><b>' + lang_oldpassword + '</b></label><input type="password" placeholder="' + lang_passwordenter + '" name="oldpass" required>';
  form += '<label><b>' + lang_newpassword + '</b></label><input type="password" placeholder="' + lang_passwordenter + '" name="pass" required>';
  form += '<label><b>' + lang_newpasswordrepeat + '</b></label><input type="password" placeholder="' + lang_passwordenter + '" name="pass2" required>';
  form += '<button type="button" onclick="removeModal()">' + lang_cancel + '</button><button type="submit">' + lang_submit + '</button>';
  form += '</form>';
  showModal(form);
}

function submitPass() {
  var form = document.getElementById('passForm');
  var oldpass = form.elements['oldpass'].value;
  var pass = form.elements['pass'].value;
  var pass2 = form.elements['pass2'].value;
  if (!oldpass || !pass || !pass2) {
    alert("All fields are required");
    return;
  }
  if (pass != pass2) {
    alert("Passwords don't match");
    return;
  }
  var xhr = getXHR();
  xhr.onreadystatechange = function() {
    if (xhr.readyState==4 && xhr.status==200) {
      var xml = xhr.responseXML;
      var message = "";
      if (xml) {
        var root =  xml.getElementsByTagName('root');
        if (root.length && getNode(root[0], 'error') == 0) {
          removeModal();
          alert("Password successfully changed");
          return;
        }
        errorMsg = getNode(root[0], 'message');
        if (errorMsg) { message = errorMsg; }
      }
      alert("Something went wrong\n" + message);
      xhr = null;
    }
  }
  xhr.open('POST', 'changepass.php', true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.send('oldpass=' + oldpass + '&pass=' + pass);
  return;
}