$(document).ready(function(){
    var input = {
        block_size: "",
        set_size: "",
        MM_memory_size: "",
        MM_size_type: "",
        cache_memory_size: "",
        cache_size_type: "",
        cache_cycle_time: "",
        memory_cycle_time: "",
        program_flow: "",
        program_flow_type: ""
    }

    function getInput(obj){
        obj.block_size = document.getElementById("block_size").value;
        obj.set_size = document.getElementById("set_size").value;
        obj.MM_memory_size = document.getElementById("MM_memory_size").value;
        obj.MM_size_type = document.getElementById("MM_size_type").value;
        obj.cache_memory_size = document.getElementById("cache_memory_size").value;
        obj.cache_size_type = document.getElementById("cache_size_type").value;
        obj.cache_cycle_time = document.getElementById("cache_cycle_time").value;
        obj.memory_cycle_time =  document.getElementById("memory_cycle_time").value;
        obj.program_flow = document.getElementById("program_flow").value;
        obj.program_flow_type = document.getElementById("program_flow_type").value;
    }

    function resetError(){
        document.getElementById("error").innerHTML = "";
    }

    function checkIfEmpty(obj){
        var keys = Object.keys(obj);
        var ifEmpty = false;
        keys.forEach((key, index) => {
            if(obj[key] == ""){
                ifEmpty = true;
            }
        });
        return ifEmpty;
    }

    function resetInput(){
        document.getElementById("block_size").value = "";
        document.getElementById("set_size").value= "";
        document.getElementById("MM_memory_size").value= "";
        document.getElementById("cache_memory_size").value= "";
        document.getElementById("cache_cycle_time").value= 1;
        document.getElementById("memory_cycle_time").value= 10;
        document.getElementById("program_flow").value= "";
    }


    $("#submit").click(function()
    {
        resetError();
        getInput(input);
        var validInput = true;
        
        if (checkIfEmpty(input))
        {
            var validInput = false;
            document.getElementById("error").innerHTML = "ERROR: Missing inputs";
        }

        if (validInput == true)
        {
            
            //TODO: algorithm for block set associative - MRU
            // if (MM_size_type == word)
            // {
            //     MM_memory_size = MM_memory_size / block_size;
            // }
            // if (cache_size_type == word)
            // {
            //     cache_size_type = cache_size_type / block_size;
            // }
            cache = new Array(set_size);
            for (i = 0; i < set_size; i++)
            {
                cache[i] = [];
            }
            sequence = program_flow.split(" ");
        }
    });

    $("#reset").click(function()
    {
        resetError();
        resetInput();
    });
});