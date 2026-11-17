select tablename, rowsecurity from pg_tables where schemaname = 'public' order by 1;
select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies where schemaname in ('public','storage') order by 1,2,3;
