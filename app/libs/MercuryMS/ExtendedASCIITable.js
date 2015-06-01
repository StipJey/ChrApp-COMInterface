define(function(require){
    function ExtendedASCIITable() {
        var table = [];
        //Русские заглавные
        table[1040] = 128;
        table[1041] = 129;
        table[1042] = 130;
        table[1043] = 131;
        table[1044] = 132;
        table[1045] = 133;
        table[1046] = 134;
        table[1047] = 135;
        table[1048] = 136;
        table[1049] = 137;
        table[1050] = 138;
        table[1051] = 139;
        table[1052] = 140;
        table[1053] = 141;
        table[1054] = 142;
        table[1055] = 143;
        table[1056] = 144;
        table[1057] = 145;
        table[1058] = 146;
        table[1059] = 147;
        table[1060] = 148;
        table[1061] = 149;
        table[1062] = 150;
        table[1063] = 151;
        table[1064] = 152;
        table[1065] = 153;
        table[1066] = 154;
        table[1067] = 155;
        table[1068] = 156;
        table[1069] = 157;
        table[1070] = 158;
        table[1071] = 159;
        //Русские строчные
        table[1072] = 160;
        table[1073] = 161;
        table[1074] = 162;
        table[1075] = 163;
        table[1076] = 164;
        table[1077] = 165;
        table[1078] = 166;
        table[1079] = 167;
        table[1080] = 168;
        table[1081] = 169;
        table[1082] = 170;
        table[1083] = 171;
        table[1084] = 172;
        table[1085] = 173;
        table[1086] = 174;
        table[1087] = 175;
        table[1088] = 224;
        table[1089] = 225;
        table[1090] = 226;
        table[1091] = 227;
        table[1092] = 228;
        table[1093] = 229;
        table[1094] = 230;
        table[1095] = 231;
        table[1096] = 232;
        table[1097] = 233;
        table[1098] = 234;
        table[1099] = 235;
        table[1100] = 236;
        table[1101] = 237;
        table[1102] = 238;
        table[1103] = 239;

        this.getExtendASCIICodeFromUTF = function(aUTF8Code) {
            return table[aUTF8Code];
        };
    }
return new ExtendedASCIITable()});