export default interface IPage{
    schema:string 

    filter();

    buttons();

    render();
}