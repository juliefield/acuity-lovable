      var allkeys = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','22a','22b','23','23a','23b','24','25','26','27','28','29'];
      var qstkeys = ['12','13','14','15','16','17','18','19','20','21','22','22a','22b','23','23a','23b','24','25','26','27','28','29'];

      $(".mon-submit").bind("click", function () {
          $("#txtTotal").val($("#montotal").html());
          $("#txtTotalPoints").val($("#montotalpoints").html());
          $("#txtTotalPossible").val($("#montotalpossible").html());
          $("#txtSuccessRate").val($("#monsuccessrate").html());
          $("#txtComments").val($("#Comments").val());

          for (var n in allkeys) {
              var i = allkeys[n];
              $("#txtQ" + i).val($("#Q" + i).val());
              $("#txtQ" + i + "text").val($("#Q" + i + " option:selected").text());
              $("#txtQ" + i + "Comments").val($("#Q" + i + "Comments").val());
          }
          $("#txtCalllength_HH").val($("#inpCalllength_HH").val());
          $("#txtCalllength_MM").val($("#inpCalllength_MM").val());
          $("#txtCalllength_SS").val($("#inpCalllength_SS").val());
          $("#txtSitelocation").val($("#selSitelocation").val());
          $("#txtJurisdiction").val($("#selJurisdiction").val());
          $("#txtCalltype").val($("#selCalltype").val());
          $("#txtCategory_collections").val($("#selCategory_collections").val());
          $("#txtCategory_move").val($("#selCategory_move").val());
          $("#txtLanguage").val($("#selLanguage").val());
          $("#txtEligible").val($("#selEligible").val());
          $("#txtValidtransfer").val($("#selValidtransfer").val());
          $("#txtReviewType").val($("#selReviewType").val());
          $("#txtCallpartyType").val($("#selCallpartyType").val());
          $("#txtReviewName").val($("#inpReviewName").val());
          $("#txtIntType").val($("#selIntType").val());
      });

      $(document).ready(function () {
        $(".hideQ22sub").hide();
        $("#Q22").change(function() {
            if ($(this).val() == "No") {
                $(".hideQ22sub").hide();
                $("#Q22a").val("N/A").next().next().removeClass("highlight");          
                $("#Q22b").val("N/A").next().next().removeClass("highlight");    
            } else if ($(this).val() == "Yes") {
                $(".hideQ22sub").show();
            }
        });
        $(".hideQ23sub").hide();
        $("#Q23").change(function() {
            if ($(this).val() == "No") {
                $(".hideQ23sub").hide();
                $("#Q23a").val("N/A").next().next().removeClass("highlight");     
                $("#Q23b").val("N/A").next().next().removeClass("highlight");     
            } else if ($(this).val() == "Yes") {
                $(".hideQ23sub").show();
            }
        });           

        function updateSection1Score() {
            let sec1score = 0;
            let sec1possiblescore = 0;
            for (let i = 1; i <= 11; i++) {
                let value = $(`#Q${i}`).val();
                let score = $(`#Q${i}`).attr("score");
                if (value !== "" && !isNaN(value)) {
                    sec1score += parseInt(value, 10);
                    sec1possiblescore += parseInt(score, 10);
                }
            }
            s1t = ((sec1score / sec1possiblescore) * 100).toFixed() + '%';
            $(".sec1total").html(s1t);
            $(".section1score").html(sec1score);
            $(".mon-section1total-possible").html(sec1possiblescore);
        }
        for (let i = 1; i <= 11; i++) {
            $(`#Q${i}`).change(updateSection1Score);
        }
        updateSection1Score();

        function updateSection2Score() {
            let sec2score = 0;
            let sec2possiblescore = 0;
            for (var n in qstkeys) {
                var i = qstkeys[n];
                let value = $(`#Q${i}`).val();
                let score = $(`#Q${i}`).attr("score");
                if (value !== "" && !isNaN(value)) {
                    sec2score += parseInt(value, 10);
                    sec2possiblescore += parseInt(score, 10);
                }
            }
            s2t = ((sec2score / sec2possiblescore) * 100).toFixed() + '%';             
            $(".sec2total").html(s2t);
            $(".section2score").html(sec2score);
            $(".mon-section2total-possible").html(sec2possiblescore);
        }
        for (var n in qstkeys) {
            var i = qstkeys[n];
            $(`#Q${i}`).change(updateSection2Score);
        }
        updateSection2Score();
        

          var colors = ["#eeeeee", "#dddddd"];
          var tgl = 0;
          $(".mon-content ol li").each(function () {
              $(this).css("background", colors[tgl]);
              if (!tgl) tgl = 1; else tgl = 0;
          });

          $("#Comments").val($("#txtComments").val());
          $("#Comments").autogrow();

          for (var n in allkeys) {
              var i = allkeys[n];
              $("#Q" + i).val($("#txtQ" + i).val());
              $("#Q" + i + "Comments").val($("#txtQ" + i + "Comments").val());
              $("#Q" + i + "Comments").autogrow();
          }
          for (var n in allkeys) {
              var i = allkeys[n];
              if ($("#Q" + i).val() == "") {
                  $("#Q" + i + " option[value='']").attr('selected', 'selected')
              }
              else {
                  if ($("#txtQ" + i + "text").val() != "") {
                    //WAS: $("#Q" + i + ' option:contains("' + $("#txtQ" + i + "text").val() + '")').attr('selected', 'selected');
                    $("#Q" + i + " option[text='" + $("#txtQ" + i + "text").val() + "']").attr('selected', 'selected');
                  }
              }
          }

          //Buttons for answers.
          function buttonsforanswers() {
            $(".mon-answer select").each(function() {
                if (!$(this).parent().hasClass("mon-answer-special")) {
                  var me = this;
                  $(" option",this).each(function() {
                    if ($(this).val() != "") {
                      var bld = '<input type="button" value="' + $(this).text() + '" class="highlight-hover';
                      if ($(me).val() == $(this).val()) {
                        bld += ' highlight';
                      }
                      bld += '">';
                      $(me).parent().append(bld);
                    }
                  })
                  $(me).hide();
                }
              });
          }
          buttonsforanswers();

          $(".highlight-hover").bind("click", function() {
            var text = $(this).val();
            var sel = $(" select",$(this).parent());
            $(" option", sel).each(function() {
                if (text == $(this).text()) {
                  $(sel).val($(this).val())
                }
            });
            $(sel).trigger("change");
            $(".highlight-hover",$(this).parent()).removeClass("highlight");
            $(this).addClass("highlight");

          });

          $(".sel_time").keypress(function (e) {
              if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                  //display error message
                  $("#errmsg").html("Digits Only").show().fadeOut("slow");
                  return false;
              }
          });

          $("#Address").val($("#txtAddress").val());

          $(".mon-answer select").each(function () {
              $(this).trigger("change");
          });

          if ($("#lblRole").html() == "NEW") {
              $("#submitme").show();
              $("#closeme").show();
          }
          else if ($("#lblRole").html() == "CSR") {
              $("#submitme").hide();
              $("select").attr("disabled", "disabled");
              $("textarea").attr("disabled", "disabled");
              $("#closeme").show();
              $("#deleteme").hide();
          }
          else {
              $("#submitme").attr("value", "Update");
              $("#submitme").show();
              $("#deleteme").show();
              $("#closeme").show();
          }
          setCategory($(".select-call-type select").val());
      });

      function testblanks(me) {

          var tot = 0;
          var possible = 0;
          var p;
          var v;
          var blanksfound = false;
          if (me != null) {
              p = $(me).parent();
              v = $(me).val();
              if (v == "") {
                v = "&nbsp;"
              }
              else {
                if (isNaN(v)) {
                  v = "&nbsp;"
                }
              }
              $("span", p).html(v);
          }
            var autofail = false;
            var tot = 0;
            var possible = 0;
            var blanksfound = false;
            $(".mon-answer select").each(function () {
                if (!$(this).hasClass("mon-answer-special")) {
                    var awarded = false;
                    var score_add = $(this).attr("score");
                    var val = $(this).val();
                    if (val !== "") {                            
                        if (!isNaN(val)) {
                            tot += parseInt(val, 10);
                            possible += parseFloat(score_add, 10);
                            awarded = true;
                        } else {
                            awarded = false;
                        }
                    } else {
                        blanksfound = true;
                    }
                    if ($(this).hasClass("Autofail") && val !== "") {
                        if (val == 0) {
                            autofail = true;
                        }
                    }
                }   
            });

            if (autofail) {
                tot = 0;
                $(".ac-autofail").addClass("sel-autofail");
                $(".ac-autofail").show();
            } else {
                $(".ac-autofail").removeClass("sel-autofail");
                $(".ac-autofail").hide();
            }

            blanksfound = $("select[id^='Q']").filter(function() {
                return $(this).val() === "";
            }).length > 0;

            if ($("#selReviewType").val() == "" || $("#selCallpartyType").val() == "" || $("#selIntType").val() == "" || $("#lblAgent").html() == "") {
                blanksfound = true;
            }

            if (!blanksfound) {
                $(".mon-submit").removeAttr("disabled");
            } else {
                $(".mon-submit").attr("disabled", "disabled");
            }

            $(".mon-total").html(tot + "/" + possible);
            var sr = "";
            if (possible == 0) {
                sr = "100%";
            } else {
                sr = ((tot / possible) * 100).toFixed() + '%';
            }
            $(".mon-total-points").html(tot);
            $(".mon-total-possible").html(possible);
            $(".mon-success-rate").html(sr);          
      }
      $(".mon-answer select").bind("change", function () {
          testblanks(this);
      });
      $("#selReviewType").bind("change", function () {
          testblanks(this);
      });
      $("#selCallpartyType").bind("change", function () {
          testblanks(this);
      });
      $("#selIntType").bind("change", function () {
          testblanks(this);
      });

      function setCategory(cat) {
        if (cat == "Collections") {
            $("#selCategory_collections").show();
            $("#selCategory_move").hide();
        }
        else {
            $("#selCategory_collections").hide();
            $("#selCategory_move").show();
        }
      }

      $(".select-call-type select").bind("change", function () {
          setCategory($(this).val());
      });

    function exists(me) {
        return (typeof me != 'undefined');
    }

